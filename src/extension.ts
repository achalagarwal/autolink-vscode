// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require("fs");

let ignorePaths = new Set();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension autolink is now active!');
	let username = require("os").userInfo().username;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// vscode.
	vscode.workspace.workspaceFolders?.forEach(element => {
		

		// console.log(element);
		let path = element.uri.path;

		if(ignorePaths.has(path)){
			return;
		}

		let splits = path.split("/");

		// detect if we are on an nfs
		if (splits[1] !== "nfs"){
			return;
		}

		let localPath = "/home/" + username + "/" + splits.slice(4).join("/");
		
		if (fs.existsSync(localPath)) {
			// console.log(path, "Already exists in local home");
			ignorePaths.add(path);
			return;
		}
		
		else{
			vscode.window.showInformationMessage("The directory: " + path + " does not seem to be present in\
			in your local working directory, do you want to symlink it?", ...["Yes", "No"]).then((value) => {
				// console.log(value);
				if(value === "Yes"){
					fs.symlink(path, "/home/" + username + "/", "dir", () => {console.log("created");} );
				}
				ignorePaths.add(path);
			});
			// fs.symlink(path, "/home/" + username + "/", "dir", () => {console.log("created");} );
		}
		
		// check if the folder exists in /home/
		// let cluster = splits[]
		// for(let i = 0; i<)
		


	}); 


	// let disposable = vscode.commands.registerCommand('autolink.refresh', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from autolink!');
	// });

	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
