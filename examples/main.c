#include <stdio.h>
#include <string.h>

#define MAX_THEMES 48
#define MAX_NAME 32

typedef struct {
    char id[16];
    char name[MAX_NAME];
    char mode[8];
} ThemeEntry;

static int compare_by_name(const void *a, const void *b) {
    return strcmp(((const ThemeEntry *)a)->name, ((const ThemeEntry *)b)->name);
}

int main(void) {
    ThemeEntry catalog[] = {
        {"openai", "OpenAI", "dark"},
        {"anthropic", "Anthropic", "light"},
        {"google", "Google", "dark"},
    };

    qsort(catalog, 3, sizeof(ThemeEntry), compare_by_name);

    for (size_t i = 0; i < 3; i++) {
        printf("%s %s\n", catalog[i].name, catalog[i].mode);
    }

    return 0;
}
