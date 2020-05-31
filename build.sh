rm -rf node_modules
npm install
gulp
rm -rf ./examples/basic/node_modules
npm --prefix ./examples/basic install
rm -rf ./examples/middleware/node_modules
npm --prefix ./examples/middleware install
