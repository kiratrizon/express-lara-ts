const constant: Record<string, any> = {
  origins: JSON.parse(env("ORIGINS")) || [],
};

export default constant;
