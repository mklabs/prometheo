
all: eslint

eslint:
	eslint .

fix:
	eslint . --fix

serve: prometheus
prometheus:
	prometheus

mocha:
	mocha --timeout 16 -R spec mocha/

test:
	ava --tap -T 10000 test --serial --match="*range*" | tap-spec

testw:
	ava --watch

ava-init:
	ava --init
