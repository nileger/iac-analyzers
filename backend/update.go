package main

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	gohttp "github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

var (
	sicaPaths        []string
	clonePath        = "./tmp/iac-analyzers"
	gitHubUsername   = getEnv("GITHUB_USERNAME", "")
	gitHubName       = getEnv("GITHUB_NAME", "")
	gitHubEmail      = getEnv("GITHUB_EMAIL", "")
	gitHubAPIToken   = getEnv("GITHUB_API_TOKEN", "")
	gitHubRepository = getEnv("GITHUB_REPOSITORY", "")
	auth             = &gohttp.BasicAuth{
		Username: gitHubUsername,
		Password: gitHubAPIToken,
	}
)

/** Update the GitHub stats */
func UpdateStats() {

	/**
	Check if all required environment variables are set
	*/
	if gitHubUsername == "" || gitHubAPIToken == "" || gitHubRepository == "" {
		log.Print("Missing environment variable.")
		return
	}

	/**
	Remove repository from previous runs
	*/
	err := os.RemoveAll(clonePath)
	if err != nil {
		log.Print("Could not remove repository directory from previous run. It hasn't been cloned yet.")
	}

	/**
	Clone the repository and get the worktree
	*/
	r, err := git.PlainClone(clonePath, false, &git.CloneOptions{
		Auth:          auth,
		URL:           gitHubRepository,
		ReferenceName: plumbing.NewBranchReferenceName("update-github-stats"),
		Progress:      os.Stdout,
	})
	if err != nil {
		log.Print("Could not clone repository.")
		return
	}
	w, err := r.Worktree()
	if err != nil {
		log.Print("Could not retrieve worktree.")
		return
	}

	/**
	Backmerge main into current branch
	*/
	err = w.Pull(&git.PullOptions{
		RemoteName:    "origin",
		ReferenceName: plumbing.NewBranchReferenceName("main"),
	})
	if err != nil && err.Error() != "already up-to-date" && err.Error() != "non-fast-forward update" {
		log.Print("Could not backmerge main.")
		return
	}

	/**
	Initialize GitHub client
	*/
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: gitHubAPIToken},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	/**
	Update files
	*/
	sicaPaths = retrieveSICAPaths()
	for _, s := range sicas {
		if s.Repository.Url != "" {
			path, err := findSICAPath(s.Name)
			if err != nil {
				log.Print(fmt.Sprint("Could not find YAML file of SICA ", s.Name))
				return
			}

			input, err := ioutil.ReadFile(path)
			if err != nil {
				log.Print(fmt.Sprint("Could not open YAML file of SICA ", s.Name, " at path ", path, "."))
				return
			}

			urlParts := strings.Split(s.Repository.Url, "/")
			owner := urlParts[len(urlParts)-2]
			repoName := urlParts[len(urlParts)-1]

			stars, _ := getStars(client, ctx, owner, repoName)
			contributors, _ := getContributors(client, ctx, owner, repoName)
			latestRelease, _ := getLatestRelease(client, ctx, owner, repoName)

			if stars == "" && contributors == "" && latestRelease == "" {
				return
			}

			lines := strings.Split(string(input), "\n")
			for i, line := range lines {
				if stars != "" && strings.Contains(line, fmt.Sprint("stars: ", s.Repository.Stars)) {
					lines[i] = fmt.Sprint("  ", "stars: ", stars)
				}
				if contributors != "" && strings.Contains(line, fmt.Sprint("contributors: ", s.Repository.Contributors)) {
					lines[i] = fmt.Sprint("  ", "contributors: ", contributors)
				}
				if latestRelease != "" && strings.Contains(line, fmt.Sprint("lastRelease: ", s.Release.LastRelease)) {
					lines[i] = fmt.Sprint("  ", "lastRelease: ", latestRelease)
				}

				output := strings.Join(lines, "\n")
				err = ioutil.WriteFile(path, []byte(output), 0644)
				if err != nil {
					log.Fatalln(err)
				}
			}
		}
	}

	/**
	Add, commit, and push changes if any changes have been made
	*/
	status, err := w.Status()
	if err != nil {
		log.Print("Could not detect git status.")
		return
	}
	if !status.IsClean() {
		_, err = w.Add(".")
		if err != nil {
			log.Print("Could not add changes.")
			return
		}
		commit, err := w.Commit("chore: Update GitHub statistics", &git.CommitOptions{
			Author: &object.Signature{
				Name:  gitHubName,
				Email: gitHubEmail,
				When:  time.Now(),
			},
		})
		if err != nil {
			log.Print("Could not create commit.")
			return
		}
		_, err = r.CommitObject(commit)
		if err != nil {
			log.Print("Could not commit changes.")
			return
		}
		err = r.Push(&git.PushOptions{
			Auth: auth,
		})
		if err != nil {
			log.Print("Could not push changes.")
			return
		}
	} else {
		log.Print("No changes have been detected. Hence, no push will be made.")
	}
}

/**
Retrieve the paths of the SICAs' YAML files
*/
func retrieveSICAPaths() []string {
	var sicaPaths []string
	err := filepath.Walk(clonePath,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return err
			}
			sicaPaths = append(sicaPaths, path)
			return nil
		})
	if err != nil {
		log.Println(err)
	}
	return sicaPaths
}

/**
Find the path of a SICA's YAML given its name
*/
func findSICAPath(sicaName string) (string, error) {
	for _, path := range sicaPaths {
		if strings.Contains(path, sicaName) {
			return path, nil
		}
	}
	return "", errors.New("could not find path for the given SICA")
}

/**
Get either the value of an environment variable or a fallback value
*/
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

/**
Get the number of stars of a GitHub repository
*/
func getStars(client *github.Client, ctx context.Context, owner string, repo string) (string, error) {
	repository, _, err := client.Repositories.Get(ctx, owner, repo)
	if err != nil {
		return "", errors.New(fmt.Sprint("could not retrieve stars for ", owner, "/", repo))
	}
	return strconv.Itoa(*repository.StargazersCount), nil
}

/**
Get the latest release date of a GitHub repository
*/
func getLatestRelease(client *github.Client, ctx context.Context, owner string, repo string) (string, error) {
	latestRelease, _, err := client.Repositories.GetLatestRelease(ctx, owner, repo)
	if err != nil {
		return "", errors.New(fmt.Sprint("could not retrieve latest release for ", owner, "/", repo))
	}
	return latestRelease.PublishedAt.Format("02.01.2006"), nil
}

/**
Get the number of contributors of a GitHub repository
*/
func getContributors(client *github.Client, ctx context.Context, owner string, repo string) (string, error) {
	_, resp, err := client.Repositories.ListContributors(ctx, owner, repo, &github.ListContributorsOptions{Anon: "true", ListOptions: github.ListOptions{
		PerPage: 1,
	}})
	if err != nil {
		return "", errors.New(fmt.Sprint("could not retrieve latest release for ", owner, "/", repo))
	}

	r, _ := regexp.Compile(`(page=\d+)`)
	s := resp.Header.Get("Link")
	match := r.FindAllString(s, -1)
	if len(match) != 0 {
		return strings.Replace(match[len(match)-1], "page=", "", 1), nil
	}
	return "", errors.New(fmt.Sprint("could not retrieve contributors for ", owner, "/", repo))
}
