import serverPromise from "./server";

const start = async() => {
    const serverInstance = await serverPromise();
    serverInstance.start();
};

start();
