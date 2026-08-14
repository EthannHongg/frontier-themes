//! Rust sample — types, traits, macros, attributes

const MAX_THEMES: usize = 48;

#[derive(Debug, Clone)]
struct ThemeEntry {
    id: &'static str,
    name: &'static str,
    mode: &'static str,
}

trait Label {
    fn label(&self) -> String;
}

impl Label for ThemeEntry {
    fn label(&self) -> String {
        format!("{} {}", self.name, self.mode)
    }
}

fn catalog() -> Vec<ThemeEntry> {
    vec![
        ThemeEntry { id: "openai", name: "OpenAI", mode: "dark" },
        ThemeEntry { id: "anthropic", name: "Anthropic", mode: "light" },
        ThemeEntry { id: "linear", name: "Linear", mode: "dark" },
    ]
}

fn main() {
    let entries = catalog();
    for entry in entries.iter().take(MAX_THEMES.min(entries.len())) {
        println!("{}", entry.label());
    }
}
