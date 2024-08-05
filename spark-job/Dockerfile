FROM sbtscala/scala-sbt:openjdk-8u342_1.8.0_2.12.17 as builder

WORKDIR /app

COPY build.sbt .
COPY PasteViewsProcessor.scala .

RUN sbt package

FROM bitnami/spark:3

USER root

COPY --from=builder /app/target/scala-2.12/pasteviewsprocessor_2.12-1.0.jar /app/PasteViewsProcessor.jar

CMD ["spark-submit", "--class", "PasteViewsProcessor", "--master", "spark://spark-master:7077", "/app/PasteViewsProcessor.jar"]