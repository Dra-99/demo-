const http = require("http")
const context = require("./context")
const response = require("./response")
const request = require("./request")
const { Stream } = require("stream")

class Application {
    constructor() {
        this.middleware = [] //用来存放中间件
        // 不能直接使用导出的对象是因为每个app实例时独立的，不能互相污染
        this.context = Object.create(context)
        this.response = Object.create(response)
        this.request = Object.create(request)
    }
    
    // 使用中间件
    use (middleWare) {
        this.middleware.push(middleWare);
    }

    // 监听服务启动
    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args)
    }

    // 处理中间件递归调用
    compose(middleWares) {
        return function(ctx) {
            const dispatch = index => {
                if (index >= middleWares.length) {
                    return Promise.resolve()
                }
                const fun = middleWares[index]
                return Promise.resolve(
                    // TODO: 这里的函数是中间件，第一个参数是上下文，第二个参数是next函数，只有执行后函数才执行
                    fun(ctx, () => dispatch(++index))
                )
            }   
            return dispatch(0)
        }
    }

    createContext(req, res) {
        const context = Object.create(this.context);
        const request = (context.request = Object.create(this.request))
        const response = (context.response = Object.create(this.response))

        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;
        context.state = {}
        return context;
    }

    // 创建服务的回调函数
    callback() {
        const handleMiddleWare = this.compose(this.middleware);
        const handleRequest = (req, res) => {
            // 我们创建不同的服务应该具有不同的上下文对象，因此我们应该针对不同的服务来创建上下文
            const context = this.createContext(req, res)
            handleMiddleWare(context).then(() => {
                this.respond(context)
            }).catch(err => {
                console.log(err)
            })
        }
        return handleRequest
    }

    respond(ctx) {
        const body = ctx.body;
        const res = ctx.res;

        if (body === null) {
            res.end(null);
            res.status = 204;
            return;
        }

        if (typeof body === "string") return res.end(body);
        if (Buffer.isBuffer(body)) return res.end(body)
        if (body instanceof Stream) return body.pipe(res);
        if (typeof body === "number") return res.end(body + '')
        if (typeof body === "object") {
            const jsonStr = JSON.stringify(body);
            res.end(jsonStr)
        }
    }
}

module.exports = Application