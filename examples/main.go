// Go sample — packages, types, interfaces, functions

package main

import (
	"fmt"
	"strings"
)

const MaxRetries = 3

type ThemeCatalog struct {
	ID   string
	Name string
	Mode string
}

func (t ThemeCatalog) Label() string {
	return fmt.Sprintf("%s %s", t.Name, strings.Title(t.Mode))
}

func main() {
	catalog := []ThemeCatalog{
		{ID: "openai", Name: "OpenAI", Mode: "dark"},
		{ID: "anthropic", Name: "Anthropic", Mode: "light"},
	}

	for _, entry := range catalog {
		fmt.Println(entry.Label())
	}
}
