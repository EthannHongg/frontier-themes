/** Java sample — imports, annotations, types, javadoc */
package com.frontier.themes;

import java.util.List;
import java.util.Map;

/**
 * Catalog entry for a generated brand theme.
 * @param id brand slug
 */
public record ThemeEntry(String id, String name, String mode) {
    public static final int THEME_COUNT = 48;

    @Override
    public String toString() {
        return name + " " + mode;
    }
}

class ThemeCatalog {
    private final List<ThemeEntry> entries;

    ThemeCatalog(List<ThemeEntry> entries) {
        this.entries = entries;
    }

    void printAll() {
        for (ThemeEntry entry : entries) {
            System.out.println(entry);
        }
    }
}
