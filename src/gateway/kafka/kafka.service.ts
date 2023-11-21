import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['kafka1:9092', 'kafka2:9092'],
      logLevel: logLevel.INFO,
    });
  }

  getKafka() {
    return this.kafka;
  }

  async emit(topic: string, payload: any) {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
    await producer.disconnect();
  }
}
