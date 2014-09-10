module.exports = function(grunt) {

	grunt.initConfig({

		clean: {
		  build: ["build/"]
		},

	    gitclone: {
	        clone: {
	            options: {
	                repository: 'git@192.168.1.137:development/easystaffing.git',
	                branch: 'master',
	                directory: 'build/easystaffing'
	            }
	        }
	    },

		secret: grunt.file.readJSON('secret.json'),
		sftp: {
		  copyfiles: {
		    files: {
		      "./": "./build/easystaffing/**",
		    },
		    options: {
		      path: '<%= secret.path %>',
		      host: '<%= secret.host %>',
		      username: '<%= secret.username %>',
		      password: '<%= secret.password %>',
		      showProgress: true,
		      srcBasePath: './',
		      createDirectories: true		      
		    },
		    showProgress:true
		  }
		},
		sshexec:{
			deploy:{
				command:'cd /home/srs123/easystaffing/build/easystaffing; echo "<%= secret.password %>" | sudo -S -s npm install; cp solr.js node_modules/solr-client/lib; pkill node; nohup node app; trap exit INT '
			},
			options:{
		      host: '<%= secret.host %>',
		      username: '<%= secret.username %>',
		      password: '<%= secret.password %>',
		      path: '<%= secret.path %>'
			}
		}


	});

	grunt.registerTask('deploy',['clean','gitclone:clone','sftp:copyfiles','sshexec:deploy']);
	grunt.registerTask('clean',['clean']);

	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-contrib-clean');

};