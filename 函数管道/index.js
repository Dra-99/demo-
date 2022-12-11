// 将首字符大写
const everyFirstUpper = (str) => {
    return str.replace(/\b(\w)(\w*)\b/g, ($, $1, $2) => {
        return $1.toLocaleUpperCase() + $2
    })
}

// 将字符串出首字母外其他字母小写
const everyLowerWithoutFirst = (str) => {
    return str.replace(/\b(\w)(\w*)\b/g, ($, $1, $2) => {
        return $1 + $2.toLocaleLowerCase()
    })
}

// 将字符串中第一个单词字符小写
const fisrtLower = (str) => {
    return str.replace(/\w/, ($) => {
        return $.toLocaleLowerCase()
    })
}

// 去除空格
const trim = (str) => {
    return str.replace(/\s/g, '')
}

// 截取字符串长度
const sliceStr = (num, str) => {
    return str.slice(0, num)
}

const str = 'MY FirsT nAme';

// 这个函数用来实现函数管道
function pipe() {
    const args = Array.from(arguments);
    return function (str) {
        for (const fun of args) {
            str = fun(str)
        }
        return str
    }
}

// 函数科里化
function currly(fun) {
    // 得到剩余参数
    const args = Array.prototype.slice.call(arguments, 1);
    const that = this;
    return function() {
        const curArgs = Array.from(arguments);
        const totalArgs = args.concat(curArgs)
        // 函数.length可以得到的是函数所需参数的数量
        if (totalArgs.length >= fun.length) {
            // 剩余参数大于等于函数所需参数，那么说明函数已经全部传递该执行函数，则执行该函数
            return fun.apply(null, totalArgs);
        } else {
            // 返回一个函数，继续接受剩余参数
            totalArgs.unshift(fun);
            return that.currly.apply(that, totalArgs);
        }
    }
}

// 如果我们使用函数管道的话应该保持函数只有一个相同参数，如果参数不一致我们可以使用科里化来固定参数个数
const pipeFun = pipe(everyFirstUpper, everyLowerWithoutFirst, fisrtLower, trim, currly(sliceStr, 8));
const res = pipeFun(str)
console.log(res)