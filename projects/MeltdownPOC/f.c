#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>

int main(void){

    pid_t pid = fork();

    if(pid == 0){
        printf("Child\n");
        char *i = (char) 0x01234000;
        printf("Value %c\n", *i);
    }else{
        int arr[5] = {1, 2, 3, 4, 5};
        printf("Parent\n");
    }
}
