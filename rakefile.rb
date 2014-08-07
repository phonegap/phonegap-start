VERSION = ENV["APPVEYOR_BUILD_VERSION"] || "local"
DEPLOY_PATH = File.expand_path('deploy')
PATH_7ZIP = "C:/Program Files/7-Zip/7z.exe"
WEB_APP = "phonegap-start"

task :default => [:all]

task :all => [:createArtifacts]

task :createArtifacts => [:createFrontEndArtifact]

task :createFrontEndArtifact do
	puts 'Creating frontend deployment artifact...'
	Dir.mkdir(DEPLOY_PATH) unless Dir.exists?(DEPLOY_PATH)	
	Dir.chdir("www") do
		sh "\"#{PATH_7ZIP}\" a \"#{DEPLOY_PATH}/#{WEB_APP}-www-#{VERSION}.zip\" *"
	end
end