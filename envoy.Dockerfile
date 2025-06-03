FROM envoyproxy/envoy:v1.28-latest

COPY config/envoy.yaml /etc/envoy/envoy.yaml

CMD ["/usr/local/bin/envoy", "-c", "/etc/envoy/envoy.yaml", "--service-cluster", "proxy"] 