const parseArgs = () => {
    const args = process.argv.slice(2);

    const parsedArgs = args.reduce((acc, arg, index) => {
        if (arg.startsWith('--')) {
            acc.push(`${arg.substring(2)} is ${args[index + 1]}`);
        }
        return acc;
    }, []).join(', ');

    console.log(parsedArgs);
};

parseArgs();