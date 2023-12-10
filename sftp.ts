import SFTPClient from 'ssh2-sftp-client';

const sftp = new SFTPClient();

const config = {
  host: 'test.rebex.net',
  port: 22, // default port for SFTP
  username: 'demo',
  password: 'password'
  // For key-based authentication, use privateKey: 'your-private-key'
};


async function listFiles(remoteDirectoryPath: string) {
    try {
      await sftp.connect(config);
      const fileList = await sftp.list(remoteDirectoryPath);
      console.log(fileList);
      await sftp.end();
      return fileList;
    } catch (err) {
      console.error('Error:', err);
      await sftp.end();
      throw err;
    }
  }

async function listFilenames(remoteDirectoryPath: string): Promise<string[]> {
    try {
        await sftp.connect(config);
        const fileList = await sftp.list(remoteDirectoryPath);
        const fileNames = fileList.map(file => file.name);
        console.log(fileNames);
        sftp.end();
        return fileNames;
    } catch (err) {
        console.error('Error listing directory contents:', err);
        sftp.end();
        throw err; // or handle error as needed
    }
}

async function getFileContents(path: string, filename: string) {
    var remoteFilePath: string = path + filename;
    try {
        await sftp.connect(config);
        const fileContents = await sftp.get(remoteFilePath);
        // console.log('File contents:', fileContents.toString());
        return fileContents;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    } finally {
        await sftp.end();
    }
}



  
// Example usage
const remoteDir = '/pub/example/';
// const files = listFiles(remoteDir);

// const filenames = listFilenames(remoteDir);

// Example usage
const filename = 'imap-console-client.png';
getFileContents(remoteDir, filename).then(contents => {
  console.log('Contents of the file:', contents.toString());
}).catch(err => {
  console.error('Error:', err);
});
