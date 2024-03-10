async function loginAdmin(req, res) {
    try {
        console.log(process.env.USER, process.env.PASSWORD);

        const { username, password } = req.body;

        if (username === process.env.USER && password === process.env.PASSWORD) {
            res.cookie("token", "123456789AAAA");
            res.send("admin page");
        } else {
            res.send("login page");
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "internal server error" });
    }
}

module.exports = {loginAdmin}
