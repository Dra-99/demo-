const koa = require("./koa")
const app = new koa()
const fs = require("fs")

app.use(async (ctx, next) => {
    // buffer类型
    // ctx.body = await fs.promises.readFile("./package.json");
    // 文件流
    // ctx.body = await fs.createReadStream("./package.json")
    // 对象类型
    ctx.body = [1, 2, 3]
    await next();
})


app.listen({
    port: 4002
})