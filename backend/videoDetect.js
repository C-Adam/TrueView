import { RealityDefender } from '@realitydefender/realitydefender';

const realityDefender = new RealityDefender({
  apiKey: 'your-api-key',
});

const result = await realityDefender.detect({
  filePath: '/path/to/your/file.jpg',
});