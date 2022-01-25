#include <std/types/types.h>
#include <stdio.h>

int main() {
    String s = string_construct("Hello World");
    printf("%s\n", string_get_cstring(&s));
    String b = string_construct(", Hello World 2");
    string_append_s(&s, &b);
    string_deconstruct(&b);
    printf("%s\n", string_get_cstring(&s));
    string_append_v(&s, ", Hello World 3");
    printf("%s\n", string_get_cstring(&s));
    string_deconstruct(&s);
    return 0;
}