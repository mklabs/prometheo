
all: eslint

eslint:
	eslint .

fix:
	eslint . --fix
