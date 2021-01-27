// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
const ncp = require('ncp').ncp;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld-sample" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	const disposable2 = vscode.commands.registerCommand('extension.helloWorldRunTest', () => {
		const mocha = new Mocha({
			ui: 'bdd',
			timeout: 60000
		});
		mocha.useColors(true);
	
		const e = (c: any) => console.log(c);
		ncp(context.extensionPath, '/projects/Che-Java-Tests', async (err: any) => {
			if (err) {
				return console.error(err);
			}
	     	const testFiles = await vscode.workspace.findFiles('**/test/*.test.ts', undefined)
			console.log("Found: ");
			console.log(testFiles);
	
			// Add files to the test suite
			testFiles.forEach(f => mocha.addFile(path.resolve(f.path)));
	
			try {
				// Run the mocha test
				mocha.run((failures: any) => {
					vscode.window.showInformationMessage('Tests completed! See results in test.log file');
					const resultFile = path.resolve('/projects', 'test.log');
					vscode.commands.executeCommand('file-search.openFile', resultFile)
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					}
				});
			} catch (err) {
				e(err);
			}
		});
	});

	context.subscriptions.push(disposable, disposable2);
}
