# Makefile sample — targets, prerequisites, recipes

THEMES_DIR := ../themes
BRANDS := openai anthropic google linear
MODES := dark light

.PHONY: all clean preview

all: $(foreach brand,$(BRANDS),$(foreach mode,$(MODES),$(THEMES_DIR)/$(brand)-$(mode).json))

$(THEMES_DIR)/%-dark.json $(THEMES_DIR)/%-light.json:
	@echo "Would generate $@"

preview:
	npm run preview:ansi

clean:
	rm -f /tmp/frontier-themes-preview.log
