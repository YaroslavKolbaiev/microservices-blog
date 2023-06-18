# Kubernetes

## Deployment Commands

- kubectl get deployments - list all the running deployments
- kubectl describe deployment [depl_name] - print out details about a specific deployment
- kubectl apply -f [config_file_name] - create a deployment out of a config file
- kubectl delete deployment [depl_name] - delete a deployment

## Updating the Image

(teminal must be run in folder of image being changed)

- Step1 - The deployment must be using the 'latest' tag in the pod section
- Step2 - Make an update to your code
- Step3 - Build the IMAGE by runninig "docker build -t [image_name]."
- Step4 - Push the image to docker hub by running "docker push [image_name]"
- Step5 - run the command "kubectl rollout restart deployment [depl_name]"

## Type of Services

- CLUSTER IP - Sets an easy-remember URL to access a pod. Only exposes pods in the cluster
- NODE PORT - Makes a pod accessible from outside the cluster. Usually only used for dev purposes.
- LOAD BALANCER - makes a pod accessible from outside the cluster. This is the right way to expose a pod to the outside world
- EXTERNAL NAME - Redirects an in-cluster request to a 'NAME' url

## Load Balancer

- Tells Kebertnetes to reach out to its provider and provision a load balancer. Gets traffic in to a songle POD

## Ingress Controller

- A POD with a set of routing rules to destribute traffic to other services
