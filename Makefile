
all: eslint

eslint:
	eslint .

fix:
	eslint . --fix

serve: prometheus
prometheus:
	prometheus

test:
	ava --tap -T 10000 test --serial | tap-spec

testw:
	ava --watch

ava-init:
	ava --init
