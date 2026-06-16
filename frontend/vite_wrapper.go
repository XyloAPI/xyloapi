package main

import (
	"fmt"
	"os"
	"os/exec"
	"syscall"
)

func main() {
	portEnv := os.Getenv("PORT")
	args := []string{"node_modules/vite/bin/vite.js"}

	for _, arg := range os.Args[1:] {
		if arg == "$PORT" {
			arg = portEnv
		}
		args = append(args, arg)
	}

	nodePath, err := exec.LookPath("node")
	if err != nil {
		fmt.Fprintf(os.Stderr, "[Vite Wrapper Error] Node.js not found in PATH\n")
		os.Exit(1)
	}

	cmd := exec.Command(nodePath, args...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Start(); err != nil {
		fmt.Fprintf(os.Stderr, "[Vite Wrapper Error] Failed to start vite process: %v\n", err)
		os.Exit(1)
	}

	err = cmd.Wait()
	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			if status, ok := exitErr.Sys().(syscall.WaitStatus); ok {
				os.Exit(status.ExitStatus())
			}
			os.Exit(1)
		}
		os.Exit(0)
	}
}
