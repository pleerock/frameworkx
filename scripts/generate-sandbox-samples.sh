cd tests

rm -rf ../sandbox-samples/monolith-sample
npm run cli -- init monolith-sample -t monolith  -d ../sandbox-samples

#rm -rf ../sandbox-samples/monorepo-sample
#npm run cli -- init monorepo-sample -t monorepo  -d ../sandbox-samples
#
#rm -rf ../sandbox-samples/microservices-sample
#npm run cli -- init microservices-sample -t microservices  -d ../sandbox-samples
