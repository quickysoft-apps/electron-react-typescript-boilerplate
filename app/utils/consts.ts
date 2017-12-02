const DEFAULT_SCRIPT = `using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;

public class ProcessInfo
{
  public string Name { get; set; }
  public int Id { get; set; }
  public bool Responding { get; set; }
  public long PrivateMemorySize { get; set; }
}

public class Startup
{
    public async Task<object> Invoke(dynamic input)
    {

        var processes = Process.GetProcesses();
        var result = new List<ProcessInfo>();

        foreach (Process process in processes)
        {
            if (process.PrivateMemorySize > 100000000000/*input.threshold*/)
            {
              result.Add(new ProcessInfo()
              {
                Name = process.ProcessName,
                Id = process.Id,
                Responding = process.Responding,
                PrivateMemorySize = process.PrivateMemorySize64
              });
            }
        }

        return result;

    }
}`;

export default {
    DEFAULT_SCRIPT
};
