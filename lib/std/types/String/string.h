#ifndef STD_STRING_H
#define STD_STRING_H

typedef struct String {
    char* _c_str;
    unsigned long long _mem_size;
    unsigned long long length;
} String;

String string_construct(const char* _str);
void string_deconstruct(String* _str);
void string_append_s(String* _dest, String* _src);
void string_append_v(String* _dest, const char* _src);
char* string_get_cstring(String* _str);

#endif
