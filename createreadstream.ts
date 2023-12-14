
import * as Client from "ssh2-sftp-client";
import { ConnectOptions } from "ssh2-sftp-client";
import { Readable } from "node:stream";

export class SFTPService {
  constructor(private config: any, private readonly client = new Client()) {}

  public async downloadFile(path: string): Promise<Readable> {
    const options: ConnectOptions = this.config.sftp;
    await this.client.connect(options);
    return this.client.createReadStream(path, {
      flags: "r",
      encoding: null,
      handle: null,
      mode: 0o400,
      autoClose: true,
    });
  }
}

// Usage
async function main() {
  const sftpService = new SFTPService({
    sftp: {
      host: 'test.rebex.net',
      port: 22, // default port for SFTP
      username: 'demo',
      password: 'password'
    },
  });
  

  try {
    const sftpStream = await sftpService.downloadFile("/readme.txt");
    let data = '';

    sftpStream.on('data', (chunk) => {
      data += chunk;
    });

    sftpStream.on('end', () => {
      console.log(data);
      return data;
    });

    sftpStream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
  }
}
