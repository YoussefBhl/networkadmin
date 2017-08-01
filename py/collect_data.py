'''from netmiko import ConnectHandler
import textfsm
import manuf
def get_cdp_neighbor_details(ip, username, password):
    """
    get the CDP neighbor detail from the given device using SSH

    :param ip: IP address of the device
    :param username: username used for the authentication
    :param password: password used for the authentication
    :param enable_secret: enable secret
    :return:
    """
    # establish a connection to the device
    ssh_connection = ConnectHandler(
        device_type='cisco_ios',
        ip='192.168.1.100',
        username='admin',
        password='admin'
    )

    # enter enable mode
    #ssh_connection.enable()

    # prepend the command prompt to the result (used to identify the local host)
    result = ssh_connection.find_prompt() + "\n"

    # execute the show cdp neighbor detail command
    # we increase the delay_factor for this command, because it take some time if many devices are seen by CDP
    result += ssh_connection.send_command("show mac address-table dynamic", delay_factor=2)

    # close SSH connection
    ssh_connection.disconnect()
    #print result
    return result
def perse_results(input):
    template = open("test.textfsm")
    re_table = textfsm.TextFSM(template)
    fsm_results = re_table.ParseText(input)
    # the results are written to a CSV file
    outfile_name = open("outfile.csv", "w+")
    outfile = outfile_name
    print(re_table.header)
    for s in re_table.header:
        outfile.write("%s;" % s)
    outfile.write("\n")
    counter = 0
    for row in fsm_results:
        print(row)
        for s in row:
            outfile.write("%s;" % s)
        outfile.write("\n")
        counter += 1
    print("Write %d records" % counter)


result = get_cdp_neighbor_details('192.168.1.100','admin','admin')
#perse_results(result)
file = open('show_connected_devices.txt','w')
file.write(result)
file.close()'''