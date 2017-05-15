# Container to start from with a working HAProxy definition
FROM haproxy

# Add personalized configuration
ADD haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

# Add restart commands
#ADD restart.bash /haproxy-restart
#CMD [“bash”, “/haproxy-start”]

# Define working directory
WORKDIR /etc/haproxy

# Define default command
#CMD ["bash", "haproxy-start"]

# Expose ports
EXPOSE 80
EXPOSE 1883
