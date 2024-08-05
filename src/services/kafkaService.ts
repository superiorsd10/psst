import { Kafka, Producer } from 'kafkajs';
import config from '../config/config';

class KafkaService {
    private producer: Producer;

    constructor() {
        const kafka = new Kafka({
            clientId: 'psst',
            brokers: [config.kafkaBroker]
        });

        this.producer = kafka.producer();
    }

    async connect() {
        try {
            await this.producer.connect();
            console.log('Connected to Kafka');
        } catch (error) {
            console.error('Failed to connect to Kafka:', error);
        }
    }

    async send(message: any) {
        try {
            await this.producer.send(message);
        } catch (error) {
            console.error('Error sending message to Kafka:', error);
        }
    }

    async disconnect() {
        try {
            await this.producer.disconnect();
            console.log('Disconnected from Kafka');
        } catch (error) {
            console.error('Error disconnecting from Kafka:', error);
        }
    }
}

export const kafkaProducer = new KafkaService();
