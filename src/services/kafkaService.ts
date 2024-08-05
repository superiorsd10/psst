import { Kafka, Producer } from "kafkajs";
import config from "../config/config";

class KafkaService {
    private producer: Producer;

    constructor() {
        const kafka = new Kafka({
            clientId: 'psst', 
            brokers: [config.kafkaBroker]
        });

        this.producer = kafka.producer();
        this.connect();
    }

    private async connect() {
        await this.producer.connect();
    }

    async send(message: any) {
        try {
            await this.producer.send(message);
        } catch (error) {
            console.error('Error sending message to Kafka:', error);
        }
    }
}

export const kafkaService = new KafkaService();