# Contribution Guidelines

I'm glad you want to contribute to this project. Thanks for your time and consideration. 

There are some guidelines which all the contributing members should follow so that there is less or no conflict with each others coding styles.

## Development Environment

You are free to use any IDE or text editor you want. To maintain the consistency of writing style, this project uses [eslint][eslint homepage] with [Airbnb guidelines][airbnb github].

Make sure your choice of IDE/editor integrates with linter well. If you are confused, you can use [VSCode][vscode homepage], which is a wonderful editor. There's a `.vscode` directory in root of the repo which VSCode will automatically detect if you're using one.

Here's a list of setting currently being used to aid eslint. 

```json
{
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "files.insertFinalNewline": true,
}
```

If you feel like more settings can be added, just send a pull request with changes.

Happy Coding!


[vscode homepage]: https://code.visualstudio.com/
[eslint homepage]: https://eslint.org/
[airbnb github]: https://github.com/airbnb/javascript#table-of-contents
