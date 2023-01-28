import yargs from 'yargs';
import DirectoryObject from './models/DirectoryObject';
import type { ProjectDocument } from './models/Project';

export default async function process(
	project: ProjectDocument,
	terminal: App.Locals['terminal'],
	input: string
) {
	let output = '';

	const res = await new Promise<string>((resolve, reject) => {
		yargs
			.command(
				'cd <dir>',
				'change the working directory',
				() => {},
				async (argv) => {
					const dir = argv._[1] as string;

					// Change directory
					terminal.cwd = terminal.cwd + dir;
					const parts = dir.split('/');

					for (const part of parts) {
						// Find child folder
						const newCurr = await DirectoryObject.findOne({
							parent: terminal.curr._id,
							type: 'folder',
							name: part
						});

						if (!newCurr) {
							throw new Error('path not found');
						}

						terminal.curr = newCurr;
					}
				}
			)
			.command(
				'cwd',
				'get the working directory',
				() => {},
				() => {
					output = terminal.cwd;
				}
			)
			.command(
				'info',
				'retrieve information about the project',
				() => {},
				() => {
					const details = project.toJSON();

					output = Object.entries(details)
						.map(([key, value]) => {
							return `${key}: ${value}`;
						})
						.join('\n');
				}
			)
			.parse(input, {}, (err, _argv, output) => {
				if (err) {
					return reject(err);
				}
				resolve(output);
			});
	});

	return output || res;
}
