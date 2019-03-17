const port = process.env.PORT || process.argv[2] || 80;
const app  = requir('./app')

app.listen(port)
