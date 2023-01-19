import dbConnect from '../server/dbConnect';

interface FileMetadata {
	type: 'file' | 'folder';
	projectId: string;
	parentId: string;
}

type Directory = (string | string[] | Directory)[];

export async function traverseProject(projectId: string) {
	await dbConnect();
	const bucket = mongoose.bucket;
	if (!bucket) return [];

	const rootItems = bucket.find({
		metadata: {
			projectId,
			root: true
		}
	});
}

export default function traverse(parentId: string) {
	const bucket = mongoose.bucket;
	if (!bucket) return [];

	const directory: Directory = [];

	const items = bucket.find({
		metadata: {
			parentId
		}
	});

	items.forEach((item) => {
		const metadata = item.metadata as FileMetadata;

		if (metadata.type === 'file') {
			directory.push(item.filename);
		} else {
			directory.push(traverse(item._id.toString()));
		}
	});

	return directory;
}
