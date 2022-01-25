#include "string.h"
#include <stdlib.h>
#include <string.h>

String string_construct(const char* _str) {
    String _string;
    _string.length = strlen(_str);
    _string._mem_size = _string.length+1;
    _string._c_str = malloc(_string._mem_size);
    _string._c_str[_string._mem_size-1] = '\0';
    memcpy(_string._c_str, _str, _string._mem_size-1);

    return _string;
}

void string_deconstruct(String* _str) {
    free(_str->_c_str);
}

void string_append_s(String* _dest, String* _src) {
    unsigned long long _free_space = _dest->_mem_size - _dest->length;
    if(_free_space <= _src->length) {
        _dest->_mem_size *= 2;
        _dest->_c_str = realloc(_dest->_c_str, _dest->_mem_size);
    }

    char* _dest_ptr = _dest->_c_str + _dest->length;
    _dest->length += _src->length;

    memcpy(_dest_ptr, _src->_c_str, _src->length);
    _dest->_c_str[_dest->length] = '\0';
}

void string_append_v(String* _dest, const char* _src) {
    String _temp;
    unsigned long long _length = strlen(_src);
    _temp._c_str = malloc(_length + 1);
    memcpy(_temp._c_str, _src, _length);
    _temp._c_str[_length] = '\0';
    _temp.length = _length;

    string_append_s(_dest, &_temp);
}

char* string_get_cstring(String* _str) {
    return _str->_c_str;
}