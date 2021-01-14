module.exports = {
  transpileDependencies: ["vuetify"],
  devServer:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
          }
        },
  publicPath: process.env.NODE_ENV === "production" ? "/portal" : "/"
};
console.log("NODE ENVIRONMENT: " + process.env.NODE_ENV);
