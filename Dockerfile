FROM alpine:3.19
RUN echo "Hello from GHCR!" > /hello.txt
CMD ["cat", "/hello.txt"]
