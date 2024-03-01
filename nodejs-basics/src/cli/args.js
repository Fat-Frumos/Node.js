const parseArgs = () => {
    const args = process.argv.slice(2);

    const parsedArgs = args.reduce((acc, arg, index) => {
        if (arg.startsWith('--')) {
            acc.push(`${arg.substring(2)} is ${args[index + 1]}`);
        }
        return acc;
    }, []);

    const joined = parsedArgs.join(', ');

    console.log(joined);
};

parseArgs();