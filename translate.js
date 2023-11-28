var fs = require('fs');

var numTranslated = 0;

function deleteCache(){
	console.log('Deleting Cache!');
	if (fs.existsSync('./objects/cache.fcz')) {
		fs.unlinkSync('./objects/cache.fcz', function(error) {
			if (error) {
				throw error;
			}
		});	
	}
	
}

function replaceNonASCII(input){
	return input;
	for (i=0;i<input.length;i++)
	{
		input[i]=input[i].replace(/[őóö]/ig,"o")
		input[i]=input[i].replace(/[úűü]/ig,"u")
		input[i]=input[i].replace(/á/ig,"a")
		input[i]=input[i].replace(/é/ig,"e")
		input[i]=input[i].replace(/[ŐÓÖ]/ig,"O")
		input[i]=input[i].replace(/[ÚÜŰ]/ig,"U")
		input[i]=input[i].replace(/Á/ig,"A")
		input[i]=input[i].replace(/É/ig,"E")
	}
	return input;
}

function copyMenu(filename){
}

function loadfile(filename){
	deleteCache();
	copyMenu(filename);
	if (fs.existsSync(filename)) {

		try {
			// 1.txt 的内容
			var contents = fs.readFileSync(filename, 'utf8');	
			if(contents == undefined)
				return;
			contents = contents.split("\n");
			contents.forEach(function(element) {
				element = replaceNonASCII(element.replace(/\t/g,''));
				// console.log('Replacing:',element.split(";")[1] +'!');
				// 参数：./objects/19.txt, 女性001 D
				replaceTextInFile('./objects/'+element.split(";")[0].replace(/\s/g, ''),element.split(";")[1]);
			});
			console.log('Translated ' + numTranslated + ' items!');
		}catch(e){
			console.log(e);
		}
	}else{
		console.log("Missing file!")
	}
	

}
// ./objects/19.txt  汉化后的内容
function replaceTextInFile(filename,newstring){
	if(newstring == undefined || newstring.replace(/(^s*)|(s*$)/g, "").length ==0)
		return;
	try {
		const d = openSync(filename, 'r')

		var contents = fs.readFileSync(d, 'utf8');

		if(contents == undefined)
			return;
		contents = contents.split("\n");
		contents[1] = newstring;// + "\r";
		console.log("Translated " + filename + " with " + contents[1]);
		numTranslated++;
		contents = contents.join("\n");
		fs.writeFile(filename, contents, 'utf8', function(err) {
			if(err) {
				return console.log(err);
			}
		}); 

		closeSync(d)

	} catch(e) {
		//not exists
		console.log("Missing file:" + filename + " error: " + e);
	}
}

//
if(typeof(process.argv[2])=="undefined"){
	console.log("Missing argument!\nUse -h for help!");
}else{
	if(process.argv[2] == "-h"|| process.argv[2] == "- h"){
		console.log("The parameter must be an input file. Ex. 'translate.exe hungarian.txt'");
	}else{
		loadfile(process.argv[2]);
	}
}
