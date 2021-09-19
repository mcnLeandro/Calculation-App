const app = new Vue({
    el: '#my-iphone',
    data: {

        time: "",
        currentOperand: "",
        currentOperator: "",
        operandStack: [], //<= currentOperand
        operatorStack: [],//<= currentOperator
        display: "0",

    },
    methods:{
        checkAll: function(){
            
            console.log(`currentOperand : ${this.currentOperand}`)
            console.log(`operandStack : [ ${this.operandStack} ]`)
            console.log(`operatorStack : [ ${this.operatorStack} ]`)
            console.log(`display : ${this.display}`)
            console.log("*****************************************")

        },
        setDisplay: function(value){

            this.display = value.toLocaleString()

        },
        /*****************************
         * operator area
         ****************************/
        setCurrentOperator: function(operator){

            
            this.currentOperator = operator;

            this.setOperand() //operandの区切りがついたのでセット
            this.waitableCalculate() //ここで計算

            this.setOperator()//計算が終わったらpush
            this.setDisplay(this.operandStack[this.operandStack.length-1])

        },
        setOperator: function(){

            this.operatorStack.push(this.currentOperator)
            this.currentOperator = ""    

        },
        /*****************************
         * operand area
         ****************************/
        setCurrentOperand: function(operand){

            this.currentOperand += operand;
            this.setDisplay(this.currentOperand)


        },
        setOperand: function(){

            this.operandStack.push(Number(this.currentOperand))
            this.currentOperand = ""

        },
        /***********************
         * calculation option area
         ***********************/
        showEqualResult: function(){

            this.setOperand()
            // this.setOperator()
            this.simpleCalculate()
            this.setDisplay(this.operandStack[this.operandStack.length-1])

        },
        allClear: function(){

            this.currentOperand = "",
            this.display = "0"
            this.operandStack = []
            this.operatorStack = []

        },
        divide100: function(){

            this.showEqualResult() //とりあえず計算して、

            const l = this.operandStack.length
            const result = this.operandStack[l-1]/100

            this.operandStack.splice(l-1, 1, result)
            this.setDisplay(this.operandStack[l-1])

        },
        
        oppositeNumber: function(){

            this.showEqualResult() //とりあえず計算して、

            const l = this.operandStack.length
            const result = (-(this.operandStack[l-1]));

            console.log(result)
            console.log(this.operandStack)
            this.operandStack.splice(l-1, 1, result)
            console.log(this.operandStack)
            this.setDisplay(this.operandStack[l-1])

        },
        /*****************************
         * calculation area
         *****************************/
        toPrecedenceLevel(operator){

            if(operator === "×" || operator === "÷")return 2;
            else if(operator === "+" || operator === "-")return 1;
            else console.log('ERROR: this isn\'t a operator')

        },
        waitableCalculate: function(){

            const operator1 = this.operatorStack[this.operatorStack.length-1]
            const operator2 = this.currentOperator

            //ベースケース
            if(

                //currentOperandはすでにstackにpushされていないといけない(空でないといけない).
                this.currentOperand !== "" ||
                //これからpushするのでからではいけない
                this.currentOperator === "" ||

    
                this.operandStack.length === 1 ||
                this.operatorStack.length === 0 ||

                //右からくるやつが、高いレベルなら、次のoperandを待たなくてはいけない。
                this.toPrecedenceLevel(operator1) < this.toPrecedenceLevel(operator2)

            )return;

            this.simpleCalculate()
            this.waitableCalculate()

            this.checkAll()

        },
        simpleCalculate: function(){


            const operatorStackLength = this.operatorStack.length;
            const operandStackLength = this.operandStack.length

            if(operandStackLength === 1)return;

            const operator = this.operatorStack[operatorStackLength-1]

            let result = this.operandStack[operandStackLength-2]
            switch(operator){

                case '+' : result += this.operandStack[ operandStackLength-1 ];break;
                case '-' : result -= this.operandStack[ operandStackLength-1 ];break;
                case '×' : result *= this.operandStack[ operandStackLength-1 ];break;
                case '÷' : result /= this.operandStack[ operandStackLength-1 ];break;
                default:break;

            }

            this.operandStack.splice(operandStackLength-2, 1, result)
            this.operandStack.pop()
            this.operatorStack.pop()

        },
        /***************
         * else area
         ****************/
        setTime: function(){

            const date = new Date

            let hours = date.getHours().toString();
            let minutes = date.getMinutes().toString();

            hours   = hours.length == 1   ? "0" + hours   : hours ;
            minutes = minutes.length == 1 ? "0" + minutes : minutes ;

            this.time = `${hours}:${minutes}`;
        }
        
    }

}) 

setInterval(app.setTime,1000);