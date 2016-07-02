uri = URI.parse(ENV["REDISTOGO_URL"] || "redis://127.0.0.1")
$redis = Redis.new(:host => uri.host, :port => uri.port || 6379, :password => uri.password)

if !$redis.hexists 'languages', 'en'
	$redis.hset 'languages', 'en', ''
end

I18n.config.available_locales = $redis.hkeys 'languages'