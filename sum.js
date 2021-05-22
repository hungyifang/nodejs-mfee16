// console.log("hello");
function sum(n){
    let arr=[];
    for(let i=1;i<=n;i++){
        arr.push(i)
    }
    let total=arr.reduce(function(accu,cur){
        return accu+cur;
    },0);
    console.log(total)
}
sum(5);
