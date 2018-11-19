# SCOOPR

Need to scoop some files from someone else's webserver?

Do those files happen to be named as incrementing numbers with leading zeroes? 

Well have I got the command line utility for you!! Step right over those bit-shift operators, they won't bite!!!

## Installation

```sh
$ git clone git@github.com:wosevision/scoopr.git
$ cd scoopr
$ npm link
```

## Usage

```sh
$ scoopr --help
# scoopr <url> [start] [end] [pad] [format] [output]
```

## Options

```
url     URL to fetch content from
                     [string] [default: "https://serebii.net/sunmoon/pokemon"]
start   number to begin from                             [number] [default: 1]
end     number to end at                               [number] [default: 809]
pad     whether to add leading zeros to output files[boolean] [default: false]
format  format of files to scoop                     [string] [default: "png"]
output  directory to save files to                     [string] [default: "."]
```

## Example

```sh
$ scoopr https://serebii.net/sunmoon/pokemon --start 90 --end 120 --output ./pokemon
# get Pokemon 90-120 from Serebii.net and saves them to <current directory>/pokemon/
```