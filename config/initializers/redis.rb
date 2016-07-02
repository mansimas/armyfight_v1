if ENV["REDISTOGO_URL"]
	uri = ENV["REDISTOGO_URL"]
	$redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
else
	$redis = Redis.new(:host => '127.0.0.1', :port => 6379)
end